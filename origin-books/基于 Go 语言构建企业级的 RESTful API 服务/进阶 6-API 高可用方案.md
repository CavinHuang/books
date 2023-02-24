
# 进阶 6-API 高可用方案
---

# API 高可用方案

本小节为可选小节。因为该方案需要有至少两台服务器，没有多台服务器的读者只需要了解即可。

## 方案介绍

Nginx 自带负载均衡功能，并且当 Nginx 后端某个服务器挂掉后，Nginx 会自动剔除该服务器，将请求转发到可用的服务器，通过这种方式实现了后端 API 服务的高可用（HA）。但是 Nginx 是单点的，如果 Nginx 挂了，后端的所有服务器就都不能访问，所以在实际生产环境中，也需要对 Nginx 做高可用。

Keepalived 是一个高性能的服务器高可用或热备解决方案，Keepalived 主要来防止服务器单点故障的发生问题，可以通过 Keepalived 对前端 Nginx 实现高可用。Keepalived + Nginx 的高可用方案具有如下特点：

1.  服务功能强大
2.  维护简单

## Keepalived 简介

Keepalived 以 VRRP 协议为基础来实现高可用性。VRRP（Virtual Router Redundancy Protocol，虚拟路由冗余协议）是用于实现路由器冗余的协议，它将两台或多台路由器设备虚拟成一个设备，对外提供虚拟路由器 IP（一个或多个），如下图所示。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/6/5/163cec3864bd8244~tplv-t2oaga2asx-image.image)

在上图中，将 Nginx + Keepalived 部署在两台服务器上，拥有两个真实的 IP（IP1 和 IP2），通过一定的技术（如 LVS）虚拟出一个虚拟 IP（VIP），外界请求通过访问 VIP 来访问服务。在两台 Nginx + Keepalived 的服务器上，同一时间只有一台会接管 VIP（叫做 Master）提供服务，另一台（叫做 Slave）会检测 Master 的心跳，当发现 Master 停止心跳后，Slave 会自动接管 VIP 以提供服务（此时，Slave 变成 Master）。通过这种方式来实现 Nginx 的高可用，通过第 19 节可以知道，Nginx 可以对后台 API 服务器做高可用，这样通过 Nginx + Keepalived 的组合方案就实现了整个 API 集群的高可用。

## 部署

Keepalived + Nginx 的部署方案网上有很多详细的教程。因为小册篇幅限制，这里不再详细说明，读者如需了解，请参考 [Keepalived+Nginx实现高可用（HA）](https://blog.csdn.net/xyang81/article/details/52556886)。
    